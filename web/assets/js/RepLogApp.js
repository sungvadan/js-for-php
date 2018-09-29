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
        this.$wrapper.on(
            'click',
            '.js-delete-rep-log',
            this.handleRepLogDelete.bind(this)
        );
        this.$wrapper.on(
            'click',
            'tbody tr',
            this.handleRowClick.bind(this)
        );
        this.$wrapper.on(
            'submit',
            '.js-new-rep-log-form',
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
            var tbody = this.$wrapper.find('tbody');
            var self = this;
            $.ajax({
                url: $form.attr('action'),
                method: 'POST',
                data: $form.serialize(),
                success: function (data) {
                    tbody.append(data);
                    self.updateTotalWeightLifted();
                },
                error:function (jqXhr) {
                    $form.closest('.js-new-rep-log-form-wrapper').html(jqXhr.responseText);
                }
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