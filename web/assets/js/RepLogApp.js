'use strict';
(function (window, $) {
    window.RepLogApp = function ($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper($wrapper);
        console.log(
            'test'.__proto__,
            [].__proto__,
            (new Date()).__proto__


        );
        this.$wrapper.find('.js-delete-rep-log').on(
            'click',
            this.handleRepLogDelete.bind(this)
        );
        this.$wrapper.find('tbody tr').on(
            'click',
            this.handleRowClick.bind(this)
        );
        this.$wrapper.find('.js-new-rep-log-form').on(
            'submit',
            this.handleFormSubmit.bind(this)
        )
    };

    $.extend(window.RepLogApp.prototype,{
        handleRepLogDelete: function (e) {
            e.preventDefault();
            var $link = $(e.currentTarget);
            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');
            var deleteUrl = $link.data('url');
            var $row = $link.closest('tr');
            var self = this
            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
                success: function () {
                    $row.fadeOut('normal', function () {
                        $row.remove();
                        self.updateTotalWeightLifted();
                    });
                }
            });
        },
        handleRowClick: function () {
            console.log('row click');
        },
        updateTotalWeightLifted: function () {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.caculateTotalWeight()
            );
        },
        handleFormSubmit: function (e) {
            e.preventDefault();
            var $form = $(e.currentTarget);
            $.ajax({
                url: $form.attr('action'),
                method: 'POST',
                data: $form.serialize()
            })
        }

    })

    /**
     * Private object
     */

    var Helper = function ($wrapper) {
            this.$wrapper = $wrapper;
    };

    $.extend(Helper.prototype, {
        caculateTotalWeight : function () {
            var totalWeight = 0;
            this.$wrapper.find('tbody tr').each(function () {
                totalWeight += $(this).data('weight');
            });
            return totalWeight;
        }
    });
})(window, jQuery);